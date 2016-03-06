from scrap import ScrapCS
import os
from flask import Flask
from flask import Response
from flask import render_template
from prim import Primitives
import time

app = Flask(__name__)

@app.errorhandler(404)
def page_404(e):
    return render_template("error_404.html", title=None), 404

@app.route('/')
def hello_world():
    return render_template("index.html", title="Scoreboard")

@app.context_processor
def geter():
    def wombat(strinput):
        outter = Primitives()
        outter = outter.trunc(8, str(strinput))
        return outter
    return dict(wombat = wombat)

def event_stream():
    time.sleep(3)
    return "data: {\"isDone\": true}\n\n"

@app.route('/stream')
def stream():
    res = Response(event_stream(), content_type="text/event-stream")
    return res

@app.route('/data')
def data():
    sca = ScrapCS("https://ancient-anchorage-16212.herokuapp.com/")
    return sca.product

if __name__ == "__main__":
   port = int(os.environ.get("PORT", 5000))
   app.run(host='0.0.0.0', port=port, threaded=True)
