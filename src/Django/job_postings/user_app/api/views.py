from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# from rest_framework.authtoken.models import Token
# from rest_framework_simplejwt.tokens import RefreshToken

@api_view(['POST',])
def logout_view(request):
    if request.method == 'POST':
        request.user.auth_token.delete()
        return Response(status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_user_data(request):
    user = request.user
    user_data = {
        'id': user.id,
        'username': user.username,
    }
    return Response(user_data)
