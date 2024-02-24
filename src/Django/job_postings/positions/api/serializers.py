from rest_framework import serializers
from positions.models import Job

class JobSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    title = serializers.CharField()
    description = serializers.CharField()
    requisites = serializers.CharField()
    availability = serializers.DateField()
    salary = serializers.IntegerField()

    def create(self, validated_data):
        return Job.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.requisites = validated_data.get('requisites', instance.requisites)
        instance.availability = validated_data.get('availability', instance.availability)
        instance.salary = validated_data.get('salary', instance.salary)
        instance.save()
        return instance


