pipeline {
    options { timeout(time: 10, unit: 'MINUTES') }
    agent { docker { image 'node:latest' } }
    stages {
        stage('build') {
            steps {
	        sh 'yarn'
		sh 'rm -rf node_modules/docutils-react'
		sh 'mkdir node_modules/docutils-react'
		sh 'wget -O - https://jenkins.heptet.us/job/github/job/docutils-react/job/master/lastSuccessfulBuild/artifact/build/docutils-react.tar.gz | tar -zxf - -C node_modules/docutils-react'
		sh 'rm -rf node_modules/docutils-js'
		sh 'mkdir -p node_modules/docutils-js'
		sh 'wget -O - https://jenkins.heptet.us/job/github/job/docutils-js/job/master/lastSuccessfulBuild/artifact/build/docutils-js.tar.gz | tar -zxf - -C node_modules/docutils-js'
		sh 'cd node_modules/docutils-react && yarn && cd ../..'
		sh 'cd node_modules/docutils-js && yarn && cd ../..'
		sh 'yarn grunt babel browserify'
		sh 'mkdir -p tmp123'
		sh 'tar --exclude tmp123 --exclude-vcs -zc . -f tmp123/docserve.tar.gz'
            }
        }
    }
       post {
      always {
      archiveArtifacts artifacts: 'tmp123/*.tar.gz', fingerprint: true
      }
      }
 
}