job(type: Maven) {
  name '${SEMESTER}/${PROJECT}/${TEAM}'
  description 'Build and test the app.'
  scm {
    git {
      remote {
        github('${GITHUB_ORG}/${GITHUB_REPO}', 'ssh')
        credentials('GitHub SSH Key')
      }
      branches '*/master'
    }
  }
  triggers {
    githubPush()
    pullRequest {
      useGitHubHooks()
      permitAll()
    }
  }
  goals 'validate compile'

  configure { project ->
    project/publishers << 'hudson.plugins.sonar.SonarPublisher' {
      jdk('(Inherit from Job)')
      branch()
      language()
      mavenOpts()
      jobAdditionalProperties()
      settings(class: 'jenkins.mvn.DefaultSettingsProvider')
      globalSettings(class: 'jenkins.mvn.DefaultGlobalSettingsProvider')
      usePrivateRepository(false)
    }
    project/publishers << 'com.cloudbees.jenkins.GitHubCommitNotifier' {
      resultOnFailure('FAILURE')
    }
    project/prebuilders << 'com.cloudbees.jenkins.GitHubSetCommitStatusBuilder'{
    }
    project/runPostStepsIfResult {
      name 'FAILURE'
      ordinal 2
      color 'RED'
      completeBuild true
    }
  }
}
