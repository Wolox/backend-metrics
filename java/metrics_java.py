import argparse
import requests
from coverage import CoverageMetricsHelper
from dependencies import DependencyMetricsHelper
from quality import Quality

parser = argparse.ArgumentParser()

parser.add_argument("--metrics_url", "-m", help = "Server URL")
parser.add_argument("--tech", "-t", help = "Project technology")
parser.add_argument("--env", "-b", help = "Environment")
parser.add_argument("--repository", "-r", help = "Repository name")
parser.add_argument("--project_name", "-p", help = "Project name")

args = parser.parse_args()

metrics_url = args.metrics_url
metrics_url = "https://backendmetrics.engineering.wolox.com.ar/metrics" if metrics_url is None else metrics_url

tech = args.tech
tech = "java" if tech is None else tech

env = args.env
env = "development" if env is None else env

repository = args.repository
project_name = args.project_name

# Calculate metrics

coverage_metrics = CoverageMetricsHelper().calculate_code_coverage()
dependency_metric = DependencyMetricsHelper().calculate_dependencies_metrics()
quality_metris = Quality(coverage_metrics.cyclomatic_complexity,
                         coverage_metrics.total_lines_code).calculate_quality()

# Send request to server

body = {
    "tech": tech,
    "env": env,
    "repo_name": repository,
    "project_name": project_name,
    "metrics": [
      {
        "name": "code-coverage",
        "value": coverage_metrics.code_coverage,
        "version": "1.0"
      },
      {
        "name": "code-quality",
        "value": quality_metris.quality_score(),
        "version": "1.0"
      },
      {
        "name": "direct-dependencies",
        "value": dependency_metric.total_direct_dependencies(),
        "version": "1.0"
      },
      {
        "name": "indirect-dependencies",
        "value": dependency_metric.total_indirect_dependencies(),
        "version": "1.0"
      }
    ]
  }

print('Sending metrics to server:\n')
print(body)

x = requests.post(metrics_url, json = body)
