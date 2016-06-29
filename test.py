from scrap import ScrapCS
import os
from flask import Flask, Response, render_template
from prim import Primitives
from celery import Celery
import time
import requests
from werkzeug.contrib.cache import SimpleCache

app = Flask(__name__)
sca = None
#default startup datetime -> now
lastFetch = time.strftime("%m/%d/%Y %I:%M:%S %p")
cache = SimpleCache()
print(lastFetch)

def make_celery(app):
    celery = Celery(app.import_name, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)
    TaskBase = celery.Task
    class ContextTask(TaskBase):
        abstract = True
        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)
    celery.Task = ContextTask
    return celery

@app.errorhandler(404)
def page_404(e):
    return render_template("error_404.html", title=None), 404

@app.context_processor
def geter():
    def wombat(strinput):
        outter = Primitives()
        outter = outter.trunc(8, str(strinput))
        return outter
    return dict(wombat = wombat)

@app.route('/')
def hello_world():
    return render_template("index.html", title="Scoreboard")

@app.route('/stream')
def stream():
    res = Response(event_stream(), content_type="text/event-stream")
    return res

@app.route('/data')
def data():
    rev_turn = cache.get('data_return')
    if rev_turn is None:
        rev_turn = ScrapCS("https://ancient-anchorage-16212.herokuapp.com/").product
        cache.set('data_return', rev_turn, timeout=300)
    global lastFetch
    lastFetch = time.strftime("%m/%d/%Y %I:%M:%S %p")
    return rev_turn

@app.route('/help')
def about():
    return render_template("help.html", title="Help")

@app.route("/nationals")
def donate():
    return render_template("nationals.html", title="National Cards")

@app.route("/meta")
def metadata():
    res = Response("data: {\"lastFetch\": \"" + lastFetch + "\", \"isAPI\": false, \"isLogging\": true}\n\n", content_type="text/event-stream")
    return res

def event_stream():
    #time.sleep(2)
    try:
        res = requests.get("https://ancient-anchorage-16212.herokuapp.com/")
        if res.status_code == 200:
            return "data: {\"isDone\": true, \"isAvailable\": true}\n\n"
    except requests.exceptions.ConnectionError:
        return "data: {\"isDone\": false, \"isAvailable\": false}\n\n"

@app.route('/favicon_dev.png')
def favicon_dev():
    return send_from_directory(os.path.join(app.root_path, 'static', 'images'), 'favicon_dev.png', mimetype='image/png')

if __name__ == "__main__":
   port = int(os.environ.get("PORT", 5000))
   app.run(host='0.0.0.0', port=port, threaded=True, debug=True)