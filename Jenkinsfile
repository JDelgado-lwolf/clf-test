node("$nodeLabel") {
    stage('Running Jenkinsfile') {
        load "$jenkinsfilePath"
    }
    cleanWs(
        cleanWhenAborted: true,
        cleanWhenFailure: true,
        cleanWhenNotBuilt: true,
        cleanWhenSuccess: true,
        deleteDirs: true,
        disableDeferredWipeout: true,
        notFailBuild: true,)
}