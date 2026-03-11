import logging
import time

import requests


class WorkflowEngine:
    @staticmethod
    def execute(workflow):
        logging.info(f"Iniciando workflow {workflow.name}")
        # simulate a bit of work
        time.sleep(1)

        # send webhook if provided
        if getattr(workflow, "webhook_url", None):
            try:
                requests.post(workflow.webhook_url, json={"workflow": workflow.name})
            except Exception as e:
                logging.warning(f"Webhook failed: {e}")

        # pretend to deliver email
        if getattr(workflow, "email", None):
            logging.info(f"Enviar correo a {workflow.email}")
        # pretend to post to slack
        if getattr(workflow, "slack_channel", None):
            logging.info(f"Publicar en Slack canal {workflow.slack_channel}")

        logging.info("Workflow ejecutado correctamente")
        return "success"

