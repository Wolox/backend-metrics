import os


class DependencyMetricsHelper():
    def __init__(self):
        self.direct_dependencies = set()
        self.indirect_dependencies = set()

    def calculate_dependencies_metrics(self):
        dependencies_tree = os.popen('./gradlew dependencies').read()
        # remove spaces
        dependencies_tree = dependencies_tree.replace('\n\n', '\n')
        dependencies = dependencies_tree.split('\n')
        dependency_metrics = DependencyMetrics()

        for dependency in dependencies:
            if((dependency.startswith('+-') or dependency.startswith('\-')) and not dependency.endswith('(*)')):
                dependency_metrics.direct_dependencies.add(dependency.split(' ', 1)[-1])

            # If line does not start with "+"" or "\"", it may start with a white space or "|"", so it's a sub-dependency, else it's a comment
            elif((dependency.lstrip().startswith('+-') or dependency.lstrip().startswith('|') or dependency.lstrip().startswith('\-'))
                 and not dependency.endswith('(*)')):

                clean_line_indirect_dependency = ''
                # Cleaning for sub-dependencies
                if '+' in dependency:
                    clean_line_indirect_dependency = dependency.split(
                        '+', 1)[-1].split(' ', 1)[-1]
                elif '\-' in dependency:
                    clean_line_indirect_dependency = dependency.split(
                        '\-', 1)[-1].split(' ', 1)[-1]
                dependency_metrics.indirect_dependencies.add(clean_line_indirect_dependency)

        print('Direct dependencies: ' + str(dependency_metrics.total_direct_dependencies()))
        print('Indirect dependencies: ' + str(dependency_metrics.total_indirect_dependencies()))

        return dependency_metrics

class DependencyMetrics:
    def __init__(self):
        self.direct_dependencies = set()
        self.indirect_dependencies = set()
    
    def total_direct_dependencies(self):
        return len(self.direct_dependencies)

    def total_indirect_dependencies(self):
        return len(self.indirect_dependencies)
