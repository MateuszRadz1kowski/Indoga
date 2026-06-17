from locust import HttpUser, task, between

class IndogaTestUser(HttpUser):
    wait_time = between(1, 5)

    @task
    def load_recommendations(self):
        self.client.get("/raw_data/?username=Radzik123&platform=AniList")