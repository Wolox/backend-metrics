# Move to project's root folder
cd ${12}

# Check if directory has a Gemfile
if ! ls Gemfile > /dev/null ; then
  echo "Project is not a Ruby On Rails project"
  exit
fi

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

echo 'Getting elastic APM Metrics'
elastic_apm_metrics=$(elastic-apm-client -e ${elastic_apm_project})

if [ $? -eq 0 ]; then
    echo 'Success when getting Elastic APM Metrics'
else
    echo 'Failure when getting Elastic APM Metrics'
    exit 1
fi

data='{
    "tech": '\""${tech}"\"',
    "env": '\""${branch}"\"',
    "repo_name": '\""${repo_name}"\"',
    "project_name": '\""${project_name}"\"',
    "metrics": '${elastic_apm_metrics}'
  }'

echo "Sending metrics to API URL ${metrics_url}"
echo ${data} | python -m json.tool

curl -i \
  --request POST \
  ${metrics_url} \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data "${data}"
