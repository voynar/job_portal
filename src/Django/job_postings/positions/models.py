from django.db import models

class Job(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField()
    requisites = models.TextField()
    availability = models.DateField()
    salary = models.IntegerField()
    
    def __str__(self):
        return self.title


