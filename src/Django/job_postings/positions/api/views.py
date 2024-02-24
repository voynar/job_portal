from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.views import APIView
from rest_framework import status, generics, filters, viewsets
from positions.models import Job
from .serializers import JobSerializer

class JobListView(APIView):
    
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request):
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = JobSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
# ------------------------------------------------------------------------------------------------

class JobDetailView(APIView):
    
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
            serializer = JobSerializer(job)
            return Response(serializer.data)
        except Job.DoesNotExist:
            return Response(
                {"detail": f"Job with ID {pk} does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

    def put(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
            serializer = JobSerializer(job, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Job.DoesNotExist:
            return Response({"detail": "Job matching query does not exist."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
            job.delete()
            return Response({"detail": "Job deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Job.DoesNotExist:
            return Response({"detail": "Job matching query does not exist."}, status=status.HTTP_404_NOT_FOUND)



