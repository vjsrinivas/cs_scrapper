from scrap import ScrapCS
import os
from flask import Flask, Response, render_template
from prim import Primitives
from celery import Celery
import time

app = Flask(__name__)

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
    sca = ScrapCS("https://ancient-anchorage-16212.herokuapp.com/")
    return sca.product

@app.route('/about')
def about():
    return render_template("about.html", title="About Me")

def event_stream():
    time.sleep(3)
    return "data: {\"isDone\": true}\n\n"

if __name__ == "__main__":
   port = int(os.environ.get("PORT", 5000))
   app.run(host='0.0.0.0', port=port, threaded=True)
