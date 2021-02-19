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
...

steps:
  config:
    - rm -rf metrics && mkdir metrics && wget -O metrics/metrics.sh https://raw.githubusercontent.com/Wolox/backend-metrics/master/ruby_on_rails/metrics.sh && chmod +x metrics/metrics.sh
    - bundle install | tee -a metrics/bundle_install
  analysis:
    - bundle exec rubocop app spec --format simple
    - bundle exec rubycritic --path ./analysis --minimum-score 80 --no-browser | tee -a metrics/rubycritic_report
  setup_db:
    - bundle exec rails db:create
    - bundle exec rails db:schema:load
  test:
    - bundle exec rspec | tee -a metrics/rspec_report
  security:
    - bundle exec brakeman --exit-on-error
  metrics:
    - /metrics/metrics.sh repository-name 'Change me with project name' development

environment:
  RAILS_ENV: test
  GIT_COMMITTER_NAME: a
  GIT_COMMITTER_EMAIL: b
  LANG: C.UTF-8
  ROR_WOLOX_METRICS_API_KEY: ror-api-key

jenkinsEnvironment:
  - WOLOX_METRICS_API_KEY
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
