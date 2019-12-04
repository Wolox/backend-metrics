import os
import xml.etree.ElementTree as ET


class Coverage:
    def __init__(self):
        self.uncovered_conditions = 0
        self.conditions_to_cover = 0
        self.lines_to_cover = 0
        self.uncovered_lines = 0
        self.lc = 0
        self.total_lines_code = 0
        self.code_coverage = 0

    def set_variables(self):
        coverage_report_path = './build/reports/jacoco/test/jacocoTestReport.xml'
        tree = ET.parse(coverage_report_path)
        root = tree.getroot()

        for elem in root:
            if('covered' in elem.attrib):
                if(elem.attrib['type'] == 'INSTRUCTION'):
                    self.total_lines_code = int(
                        elem.attrib['missed']) + int(elem.attrib['covered'])
                elif(elem.attrib['type'] == 'COMPLEXITY'):
                    self.cyclomatic_complexity = int(
                        elem.attrib['missed']) + int(elem.attrib['covered'])
                elif(elem.attrib['type'] == 'BRANCH'):
                    self.uncovered_conditions = int(elem.attrib['missed'])
                    self.conditions_to_cover = int(
                        elem.attrib['covered']) + self.uncovered_conditions
                elif(elem.attrib['type'] == 'LINE'):
                    self.uncovered_lines = int(elem.attrib['missed'])
                    self.lines_to_cover = int(
                        elem.attrib['covered']) + self.uncovered_lines
                    self.lc = self.lines_to_cover - self.uncovered_lines

    def calculate_code_coverage(self):
        self.set_variables()
        self.code_coverage = (self.conditions_to_cover - self.uncovered_conditions + self.lc) \
            / (self.conditions_to_cover + self.lines_to_cover) * 100

        print('Code coverage ratio: ' + str(round(self.code_coverage, 2)) + "%")