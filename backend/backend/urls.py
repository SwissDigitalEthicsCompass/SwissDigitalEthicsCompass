from django.contrib import admin
from django.urls import include, path
from api.views import CreateUserView, CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls"))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
