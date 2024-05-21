from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.views import APIView

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class SurveyListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        surveys = Survey.objects.all()
        serializer = SurveySerializer(surveys, many=True)
        return Response(serializer.data)

class SurveyDetailView(generics.RetrieveAPIView):
    queryset = Survey.objects.all()
    serializer_class = SurveySerializer
    permission_classes = [permissions.IsAuthenticated]

class QuestionListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        survey_id = self.kwargs.get('surveyId')
        return Question.objects.filter(survey_id=survey_id).prefetch_related('choices')


class QuestionRetrieveView(generics.RetrieveAPIView):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserResponseListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserResponseSerializer

    def get_queryset(self):
        user = self.request.user
        return UserResponse.objects.filter(user=user)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
