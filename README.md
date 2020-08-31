# Backend Metrics

## Configuration

### Ruby on Rails

```json
# .woloxci/metrics.json

{
  "baseBranch": "development",
  "projectName": "'Change me with project name'",
  "tech": "ruby_on_rails",
  "repoName": "repository-name",
  "apmProjectName": "repository-apm-if-exists"
}
```

In `metrics` step, we should use the same configuration for  `repoName`, `projectName` and `baseBranch` used in `metrics.json` file

```yml
# .woloxci/config.yml

steps:
  config:
    - rm -rf metrics && mkdir metrics && wget -O metrics/metrics.sh https://raw.githubusercontent.com/Wolox/backend-metrics/3493da65a51e7800d0a857cc4fd197f278e6e74f/ruby_on_rails/metrics.sh && chmod +x metrics/metrics.sh
    - bundle install | tee -a metrics/bundle_install
  analysis:
    - bundle exec rubycritic --path ./analysis --minimum-score 80 --no-browser | tee -a metrics/rubycritic_report
  test:
    - bundle exec rspec | tee -a metrics/rspec_report
  metrics:
    - ./metrics/metrics.sh repository-name 'Change me with project name' development
```



```bash
# .woloxci/metrics.sh

# Move to project's root folder
cd metrics

# bundle install
direct_dependencies=$(cat bundle_install | grep "Bundle complete" | cut -d " " -f3)
total_dependencies=$(cat bundle_install | grep "Bundle complete" | cut -d " " -f6)
indirect_dependencies=$((total_dependencies - direct_dependencies))

# rspec
code_coverage=$(cat rspec_report | grep Coverage | cut -d " " -f12 | tr -dc '0-9.')
if [ -z "$code_coverage" ]; then
  code_coverage=$(cat rspec_report | grep Coverage | cut -d " " -f15 | tr -dc '0-9.')
fi

# rubycritic
code_quality=$(cat rubycritic_report | grep Score | cut -d " " -f2)

# rake environment
echo "Running rake environment to get build time..."
start=`date +"%s"`
bundle exec rake environment
end=`date +%s`
build_time=$(($end - $start))

# Sending metrics
echo "Sending metrics to the server..."

# args options or default values
DEFAULT_METRICS_URL='https://backendmetrics.engineering.wolox.com.ar/metrics'
DEFAULT_BRANCH='development'
UNDEFINED_VALUE=-1

repo_name=$1
project_name=$2
branch="${3:-$DEFAULT_BRANCH}"
metrics_url="${4:-$DEFAULT_METRICS_URL}"
code_coverage="${code_coverage:-$UNDEFINED_VALUE}"
code_quality="${code_quality:-$UNDEFINED_VALUE}"
direct_dependencies="${direct_dependencies:-$UNDEFINED_VALUE}"
indirect_dependencies="${indirect_dependencies:-$UNDEFINED_VALUE}"
build_time="${build_time:-$UNDEFINED_VALUE}"

# Results
echo "\nResults"
echo "Reponame : ${repo_name}"
echo "Project name : ${project_name}"
echo "Branch : ${branch}"
echo "metrics_url : ${metrics_url}"
echo "Code coverage (simplecov): ${code_coverage}"
echo "Code quality score (rubycritic): ${code_quality}"
echo "Direct dependencies: ${direct_dependencies}"
echo "Indirect dependencies: ${indirect_dependencies}"
echo "Build time (seconds): ${build_time}"

curl -i \
  --request POST \
  ${metrics_url} \
  --header "Accept: application/json" \
  --header "Content-Type: application/json" \
  --data '{
    "tech": '\""ruby_on_rails"\"',
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

```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Run rspec tests (`bundle exec rspec spec -fd`)
5. Run scss lint (`bundle exec scss-lint app/assets/stylesheets/`)
6. Run rubocop lint (`bundle exec rubocop app spec -R`)
7. Push your branch (`git push origin my-new-feature`)
8. Create a new Pull Request

## About

This project is written by [Wolox](http://www.wolox.com.ar).

[![Wolox](https://raw.githubusercontent.com/Wolox/press-kit/master/logos/logo_banner.png)](http://www.wolox.com.ar)
