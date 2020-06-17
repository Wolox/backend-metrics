# Move to project's root folder
cd ${12}

# Check if directory has a Gemfile
if ! ls Gemfile > /dev/null ; then
  echo "Project is not a Ruby On Rails project"
  exit
fi

# bundle install
echo "Running bundle install to calculate number of dependencies..."
bundle_output=$(bundle install | tee /dev/tty)
direct_dependencies=$(echo "${bundle_output}" | grep "Bundle complete" | cut -d " " -f3)
total_dependencies=$(echo "${bundle_output}" | grep "Bundle complete" | cut -d " " -f6)
indirect_dependencies=$((total_dependencies - direct_dependencies))

# rspec
if ! ls coverage/.last_run.json > /dev/null ; then
	echo "Running tests to generate coverage report..."
	bundle exec rspec spec | tee /dev/tty
fi
printf "Getting code coverage from last tests run..."
code_coverage=$(cat coverage/.last_run.json | python -c 'import sys, json; print json.load(sys.stdin)["result"]["covered_percent"]')
printf "done\n"

# rubycritic
echo "Running rubycritic for code quality score..."
rubycritic_output=$(bundle exec rubycritic app lib --no-browser | tee /dev/tty)
code_quality=$(echo "${rubycritic_output}" | grep Score | cut -d " " -f2)

# rake environment
echo "Running rake environment to get build time..."
start=`date +%s.%N`
bundle exec rake environment
end=`date +%s.%N`
diff=$(python -c "print(${end} - ${start})")
build_time=$(printf "%0.2f" ${diff})

# Results
echo "\nResults"
echo "Code coverage (simplecov): ${code_coverage}"
echo "Code quality score (rubycritic): ${code_quality}"
echo "Direct dependencies: ${direct_dependencies}"
echo "Indirect dependencies: ${indirect_dependencies}"
echo "Build time (seconds): ${build_time}"

# Sending metrics
echo "Sending metrics to the server..."

while test -n "$1"; do # parsing args options
  case "$1" in
    -m|--metricsUrl|--metrics_url)
      metrics_url=$2
      shift 2
      ;;
    -t|--tech)
      tech=$2
      shift 2
      ;;
    -b|--env)
      branch=$2
      shift 2
      ;;
    -r|--repository)
      repo_name=$2
      shift 2
      ;;
    -p|--project_name|--projectName)
      project_name=$2
      shift 2
      ;;
    -e|--elastic-apm-project|--elasticApmProject)
      elastic_apm_project=$2
      shift 2
      ;;
  esac
done

# args options or default values
DEFAULT_METRICS_URL='https://backendmetrics.engineering.wolox.com.ar/metrics'
DEFAULT_TECH='ruby_on_rails'
DEFAULT_BRANCH='development'
UNDEFINED_VALUE=-1

metrics_url="${metrics_url:-$DEFAULT_METRICS_URL}"
tech="${tech:-$DEFAULT_TECH}"
branch="${branch:-$DEFAULT_BRANCH}"

code_coverage="${code_coverage:-$UNDEFINED_VALUE}"
code_quality="${code_quality:-$UNDEFINED_VALUE}"
direct_dependencies="${direct_dependencies:-$UNDEFINED_VALUE}"
indirect_dependencies="${indirect_dependencies:-$UNDEFINED_VALUE}"
build_time="${build_time:-$UNDEFINED_VALUE}"

data='{
    "tech": '\""${tech}"\"',
    "env": '\""${branch}"\"',
    "repo_name": '\""${repo_name}"\"',
    "project_name": '\""${project_name}"\"',
    "metrics": [
      {
        "name": "code-coverage",
        "value": '${code_coverage}',
        "version": "1.0"
      },
      {
        "name": "code-quality",
        "value": '${code_quality}',
        "version": "1.0"
      },
      {
        "name": "direct-dependencies",
        "value": '${direct_dependencies}',
        "version": "1.0"
      },
      {
        "name": "indirect-dependencies",
        "value": '${indirect_dependencies}',
        "version": "1.0"
      },
      {
        "name": "build-time",
        "value": '${build_time}',
        "version": "1.0"
      }
    ]
  }'

echo 'Getting elastic APM Metrics'
elastic_apm_metrics=$(elastic-apm-client -e ${elastic_apm_project})

if [ $? -eq 0 ]; then
    echo "${elastic_apm_metrics}\n"
    data=$(echo "${data}" | jq ".metrics += ${elastic_apm_metrics}") 
else
    echo 'Fail to get Elastic APM metrics'
fi

echo "Sending metrics to API URL ${metrics_url}"
echo "${data}\n"

curl -i \
  --request POST \
  ${metrics_url} \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data "${data}"
