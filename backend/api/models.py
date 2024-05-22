from django.db import models
from django.contrib.auth.models import User

class Survey(models.Model):
    name = models.CharField(max_length=255)
    topic = models.CharField(max_length=255)
    image = models.ImageField(upload_to='surveys/', default='')  # Set default image path

    def __str__(self):
        return self.name

class Question(models.Model):
    survey = models.ForeignKey(Survey, related_name='questions', on_delete=models.CASCADE)
    text = models.TextField()

    def __str__(self):
        return f"Question {self.id} for Survey {self.survey.topic}"

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    score = models.FloatField()  

    def __str__(self):
        return f"Choice {self.id} for question {self.question.id}"

class UserResponse(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    survey = models.ForeignKey('Survey', on_delete=models.CASCADE, default=None)  
    total_points = models.FloatField(default=0)
    created_at = models.DateTimeField(default=None)

    def __str__(self):
        return f'{self.user.username} - {self.survey.topic}'
