FROM public.ecr.aws/lambda/python:3.9

# Install system dependencies
RUN yum install -y libsndfile

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

# Copy application code
COPY app.py ${LAMBDA_TASK_ROOT}/
COPY preprocessing.py ${LAMBDA_TASK_ROOT}/

# Copy models directory
COPY models/ ${LAMBDA_TASK_ROOT}/models/

# Set Lambda handler
CMD [ "app.handler" ]
