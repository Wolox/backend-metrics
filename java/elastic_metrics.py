import subprocess
import json

class ElasticMetrics():
  def __init__(self, project_name):
    self.project_name = project_name

  def get_metrics(self):
    command = ['npx', 'elastic-apm-client', '-e', self.project_name]
    child_process = subprocess.Popen(command, stdout=subprocess.PIPE)
    child_process.wait()
    if child_process.returncode != 0:
      print('Can not get Elastic APM metrics')
      return []
    
    result = child_process.stdout.read()
    return json.loads(result)

