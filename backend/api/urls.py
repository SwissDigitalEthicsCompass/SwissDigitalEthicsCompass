from django.urls import path
from .views import (SurveyListView, SurveyDetailView, QuestionListView,
                    QuestionRetrieveView, UserResponseListView)

urlpatterns = [
    path('surveys/', SurveyListView.as_view(), name='survey-list'),
    path('surveys/<int:pk>/', SurveyDetailView.as_view(), name='survey-detail'),
    path('survey/<int:surveyId>/questions/', QuestionListView.as_view(), name='question-list'),
    path('questions/<int:pk>/', QuestionRetrieveView.as_view(), name='question-detail'),
    path('user-responses/', UserResponseListView.as_view(), name='user-response-list'),
]
