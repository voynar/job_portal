from django.urls import path, include
from .views import JobListView, JobDetailView

urlpatterns = [
    path('list/', JobListView.as_view(), name='job-list'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
]