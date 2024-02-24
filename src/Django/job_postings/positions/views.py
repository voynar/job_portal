# from django.shortcuts import render
# from .models import Job
# from django.http import JsonResponse


# def job_list(request):
#     jobs = Job.objects.all()
#     data = {
#         'jobs': list(jobs.values())
#         }
#     return JsonResponse(data)


# def job_details(request, pk):
#     job = Job.objects.get(pk=pk)
#     data = {
#         'title': job.title,
#         'description': job.description,
#         'requisites': job.requisites,
#         'availability': job.availability,
#         'salary': job.salary,
#     }
#     return JsonResponse(data)



