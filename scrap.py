import requests
from bs4 import BeautifulSoup
import time


class TeamData():
    __slots__ = ['gr', 'dr', 'teamid', 'loc', 'div', 'tier', 'sc_image', 'time', 'score', 'penalties']

    def __init__(self, gr, dr, teamid, loc, div, tier, sc_image,time, score, penalties):
        self.gr = gr
        self.dr = dr
        self.teamid = teamid
        self.loc = loc
        self.div = div
        self.tier = tier
        self.sc_image = sc_image
        self.time = time
        self.score = score
        self.penalties = penalties #0 - Over time limit | 1 - Multiple images


class ScrapCS:
    def __init__(self, address):
        self.address = address
        self.text = self.getRawScore()
        self.teamdata = self.processRaw(self.text)
        self.product = self.createJSON(self.teamdata)

    scoreOn = False
    processTime = None

    def getRawScore(self):
        try:
            query = requests.get(self.address)
            if(query.status_code == 200):
                self.scoreOn = True
                return query.text
            else:
                self.scoreOn = False
                return "<error></error>"
        except Exception as e:
            self.scoreOn = False
            return "<error></error>"

    def processRaw(self, text):
        lister = []
        if text != "<error></error>":
            text_raw = BeautifulSoup(text, "html.parser")
            titer = text_raw.find_all('tr', {'class': 'clickable'})

            for index in range(len(titer)):
                text_sub = BeautifulSoup(str(titer[index]), "html.parser")
                result = text_sub.findAll('td')
                if len(str(result[7].text)) == 1:
                    if str(result[7].text) == "M":
                        _tempPen = [False, True]
                    else:
                        _tempPen = [True, False]
                elif len(str(result[7].text)) > 1:
                    _tempPen = [True, True]
                else:
                    _tempPen = [False, False]

                lister.append(TeamData(index+1, 0, str(result[0].text), str(result[2].text), str(result[1].text),
                                       str(result[3].text), int(result[4].text), str(result[5].text), int(result[6].text),
                                       _tempPen))
            return lister
        else:
            return lister

    def createJSON(self, teamdata):
        if teamdata == []:
            return "\t{\n\t\t\"data\": []\n\t}"
        else:
            division = ["All Service","Open","Middle School"]
            division_op = ["Platinum","Gold","Silver"]
            dv_a, dv_o, dv_m = 0,0,0

            mainbody = "\t{\n\t \"data\": [\n"
            for index in range(len(teamdata)):
                #Determine Position in Division rank (Open including all)
                #Division rank is not including tier in Open division
                for pepper in range(len(division)):
                    if teamdata[index].div == "All Service":
                        dv_a += 1
                        teamdata[index].dr = dv_a
                        break
                    elif teamdata[index].div == "Middle School":
                        dv_m += 1
                        teamdata[index].dr = dv_m
                        break
                    elif teamdata[index].div == "Open":
                        dv_o += 1
                        teamdata[index].dr = dv_o
                        break
                    else:
                        continue

                meandata = "\t\t{\n"
                meandata += str("\t\t\t\"{0}\": {1},\n").format("gr", teamdata[index].gr)
                meandata += str("\t\t\t\"{0}\": {1},\n").format("dr", teamdata[index].dr)
                meandata += str("\t\t\t\"{0}\": \"{1}\",\n").format("teamid", teamdata[index].teamid)
                meandata += str("\t\t\t\"{0}\": \"{1}\",\n").format("loc", teamdata[index].loc)
                meandata += str("\t\t\t\"{0}\": \"{1}\",\n").format("div", teamdata[index].div)
                meandata += str("\t\t\t\"{0}\": \"{1}\",\n").format("tier", teamdata[index].tier)
                meandata += str("\t\t\t\"{0}\": \"{1}\",\n").format("sc_image", teamdata[index].sc_image)
                meandata += str("\t\t\t\"{0}\": \"{1}\",\n").format("time", teamdata[index].time)
                meandata += str("\t\t\t\"{0}\": {1},\n").format("score", teamdata[index].score)
                meandata += str("\t\t\t\"{0}\": [\n\t\t\t\t{{\n\t\t\t\t\t{1},\n\t\t\t\t\t{2}\n\t\t\t\t}}\n\t\t\t]\n").format("penalties", "\"overtime\": " + str.lower(str(teamdata[index].penalties[0])), "\"images\": " + str.lower(str(teamdata[index].penalties[1])))
                meandata += str("\t\t\t}")
                if index == len(teamdata)-1:
                    meandata += "\n"
                else:
                    meandata += ",\n"
                mainbody += meandata
            mainbody += "\t\t]\n\t}"
            return mainbody