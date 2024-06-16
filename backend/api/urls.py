from django.urls import path
from .views import (SurveyListView, SurveyDetailView, QuestionListView,
                    QuestionRetrieveView, UserResponseCreateView, UserResponseViewSet, UserResponseDetailView)

urlpatterns = [
    path('surveys/', SurveyListView.as_view(), name='survey-list'),
    path('surveys/<int:pk>/', SurveyDetailView.as_view(), name='survey-detail'),
    path('survey/<int:surveyId>/questions/', QuestionListView.as_view(), name='question-list'),
    path('questions/<int:pk>/', QuestionRetrieveView.as_view(), name='question-detail'),
    path('user-responses/create/', UserResponseCreateView.as_view(), name='user-response-list'),
    path('user-responses/', UserResponseViewSet.as_view({'get': 'list'}), name='user-response-list'),
    path('user-responses/<int:pk>/', UserResponseViewSet.as_view({'get': 'retrieve'}), name='user-response-detail'),
    path('user-responses/<int:pk>/delete/', UserResponseDetailView.as_view(), name='user-response-detail-delete'),
]
