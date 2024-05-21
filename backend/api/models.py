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

class Choice(models.Model):
    question = models.ForeignKey(Question, related_name='choices', on_delete=models.CASCADE)
    text = models.CharField(max_length=255)
    score = models.FloatField()  # Changed from IntegerField to FloatField

class UserResponse(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
