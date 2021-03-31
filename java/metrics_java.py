import argparse
import requests
import os
from build_tools import BuildTool
from coverage import CoverageMetricsHelper
from dependencies import DependencyMetricsHelper
from quality import Quality

parser = argparse.ArgumentParser()

parser.add_argument("--metrics_url", "-m", help = "Server URL")
parser.add_argument("--tech", "-t", help = "Project technology")
parser.add_argument("--env", "-b", help = "Environment")
parser.add_argument("--repository", "-r", help = "Repository name")
parser.add_argument("--project_name", "-p", help = "Project name")
parser.add_argument("--key", "-k", help = "Metrics API Key")

args = parser.parse_args()

metrics_url = args.metrics_url
metrics_url = "https://backendmetrics.engineering.wolox.com.ar/metrics" if metrics_url is None else metrics_url

tech = args.tech
tech = "java" if tech is None else tech

env = args.env
env = "development" if env is None else env

api_key = args.key
api_key = "" if api_key is None else api_key

repository = args.repository
project_name = args.project_name

build_tool = BuildTool.MAVEN if 'pom.xml' in os.listdir() else BuildTool.GRADLE


# Calculate metrics

coverage_metrics = CoverageMetricsHelper().calculate_code_coverage(build_tool)
dependency_metric = DependencyMetricsHelper().calculate_dependencies_metrics(build_tool)
quality_metrics = Quality(coverage_metrics.total_lines_code).calculate_quality(build_tool)

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
        "value": quality_metrics.quality_score(),
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

headers = {
  "Authorization": api_key
}

print('Sending metrics to server:\n')
print(body)

x = requests.post(metrics_url, json = body, headers = headers)
