import os
import xml.etree.ElementTree as ET


class CoverageMetricsHelper:
    def set_variables(self):
        coverage_report_path = './build/reports/jacoco/test/jacocoTestReport.xml'
        tree = ET.parse(coverage_report_path)
        root = tree.getroot()

        metrics = CoverageMetrics()

        for elem in root:
            if('covered' in elem.attrib):
                if(elem.attrib['type'] == 'INSTRUCTION'):
                    metrics.total_lines_code = int(
                        elem.attrib['missed']) + int(elem.attrib['covered'])
                elif(elem.attrib['type'] == 'COMPLEXITY'):
                    metrics.cyclomatic_complexity = int(
                        elem.attrib['missed']) + int(elem.attrib['covered'])
                elif(elem.attrib['type'] == 'BRANCH'):
                    metrics.uncovered_conditions = int(elem.attrib['missed'])
                    metrics.conditions_to_cover = int(
                        elem.attrib['covered']) + metrics.uncovered_conditions
                elif(elem.attrib['type'] == 'LINE'):
                    metrics.uncovered_lines = int(elem.attrib['missed'])
                    metrics.lines_to_cover = int(
                        elem.attrib['covered']) + metrics.uncovered_lines
                    metrics.lc = metrics.lines_to_cover - metrics.uncovered_lines
        return metrics

    def calculate_code_coverage(self):
        os.system('./gradlew jacocoTestReport')
        metrics = self.set_variables()
        metrics.code_coverage = (metrics.conditions_to_cover - metrics.uncovered_conditions + metrics.lc) \
            / (metrics.conditions_to_cover + metrics.lines_to_cover) * 100
        return metrics

class CoverageMetrics:
    def __init__(self):
        self.uncovered_conditions = 0
        self.conditions_to_cover = 0
        self.lines_to_cover = 0
        self.uncovered_lines = 0
        self.lc = 0
        self.total_lines_code = 0
        self.code_coverage = 0
