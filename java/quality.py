import os
import xml.etree.ElementTree as ET
from build_tools import BuildTool

class Quality:
    def __init__(self, lines_of_code):
        self.lines_of_code = lines_of_code

    def calculate_quality(self, build_tool):
        self.setup_reports(build_tool)

        qualityMetrics = QualityMetrics()
        qualityMetrics.duplicated_code_percentage = self.calculate_duplicate_code()
        qualityMetrics.code_smell_score = self.calculate_code_smells()
        return qualityMetrics

    def setup_reports(self, build_tool):
        if build_tool == BuildTool.MAVEN:
            os.system('mvn pmd:pmd')
            os.system('mvn pmd:cpd')
            self.pmd_report = './target/reports/pmd/pmd.xml'
            self.cpd_report = './target/reports/pmd/cpd.xml'
        elif build_tool == BuildTool.GRADLE:
            os.system('./gradlew pmdMain')
            os.system('./gradlew cpdCheck')
            self.pmd_report = './build/reports/pmd/main.xml'
            self.cpd_report = './build/reports/cpd/cpdCheck.xml'

    def calculate_duplicate_code(self):
        tree = ET.parse(self.cpd_report)
        root = tree.getroot()
        non_duplication_score = 100

        for elem in root:
            non_duplication_score -= 0.5

        print('Duplicated code metric:\n')
        print('Non duplicate code score: ' + str(non_duplication_score))
        print('------------------------------')

        return non_duplication_score

    def calculate_code_smells(self):
        tree = ET.parse(self.pmd_report)
        root = tree.getroot()
        total_issues = 0
        high_priority = 0
        medium_priority = 0
        low_priority = 0

        for referece_file in root:
            for violation in referece_file:
                priority = int(violation.attrib['priority'])
                if(priority == 1 or priority == 2):
                    high_priority += 1
                elif(priority == 3):
                    medium_priority += 1
                elif(priority == 4 or priority == 5):
                    low_priority += 1
                total_issues += 1

        high_priority_percentage = high_priority * 100 / self.lines_of_code
        medium_priority_percentage = medium_priority * 100 / self.lines_of_code
        low_priority_percentage = low_priority * 100 / self.lines_of_code

        high_priority_weighing = high_priority_percentage * 0.60
        medium_priority_weighing = medium_priority_percentage * 0.30
        low_priority_weighing = low_priority_percentage * 0.10

        code_smells_ratio = round(((high_priority_weighing +
                                    medium_priority_weighing + low_priority_weighing) / 3), 2)

        print('Code smells:\n')
        print('Total issues: '+str(total_issues))
        print('High priority: '+str(high_priority))
        print('Medium priority: '+str(medium_priority))
        print('Low priority: '+str(low_priority))
        print('Code smells ratio: ' + str(code_smells_ratio) + "%")
        print('------------------------------')

        return 100 - code_smells_ratio

class QualityMetrics:
    def __init__(self):
        self.duplicated_code_percentage = 0
        self.code_smell_score = 0

    def quality_score(self):
        return (self.duplicated_code_percentage + self.code_smell_score) / 2
