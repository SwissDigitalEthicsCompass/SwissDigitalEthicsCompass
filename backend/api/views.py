from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework import generics, permissions, status
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

class UserResponseCreateView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserResponseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserResponseViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserResponseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserResponse.objects.filter(user=self.request.user)


class UserResponseDetailView(generics.RetrieveDestroyAPIView):
    queryset = UserResponse.objects.all()
    serializer_class = UserResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        """
        Delete a user response instance.
        """
        user_response = self.get_object()
        user_response.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)