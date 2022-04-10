pipeline {
	agent any

	environment {
		IMAGE_NAME = 'books-rest-api'
		VERSION = '1.0.0'
	}

	stages {
		stage('build') {
			steps {
				echo "currently on ${env.BRANCH_NAME}"
				sh "docker build -t koolio29/$IMAGE_NAME:$VERSION ."
			}
		}
		stage('push') {
			when {
				expression {
					env.BRANCH_NAME == 'dev' || env.BRANCH_NAME == 'master'
				}
			}
			steps {
				withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'USER', passwordVariable: 'PASSWORD')]) {
					sh "docker login -u=$USER -p=$PASSWORD"
				}
				sh "docker push koolio29/$IMAGE_NAME:$VERSION"
			}
		}
	}
	post {
		always {
			echo 'Project built has completed'
		}

		success {
			echo 'Docker image has been pushed to docker hub'
		}

		failure {
			echo 'Project build had failed'
		}
	}
}
