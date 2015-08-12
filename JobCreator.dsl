// Setup Folder Structure
folder ('${SEMESTER}')
folder ("${SEMESTER}/${PROJECT}")

// Create the basic Maven Job
def job = mavenJob("${SEMESTER}/${PROJECT}/${TEAM}")
job.with {
  description 'Duke CS 308 Project'
}

// Setup the Git SCM information
job.with {
  scm {
    git {
      remote {
        github("${GITHUB_ORG}/${GITHUB_REPO}", 'ssh')
        credentials('15bf0168-6a80-4fa3-9fa1-5a56cbad59b7')
      }
      branch 'master'
    }
  }
}

// Setup the triggers for building
job.with {
  triggers {
    githubPush()
    pullRequest {
      useGitHubHooks()
      permitAll()
    }
  }
}

// Setup the maven goals
job.with {
  goals 'validate compile'
}

job.with {  
  publishers {
    warnings(['Java Compiler (javac)', 'Maven'], ['Java Compiler (javac)': '**/*.log']) {
      includePattern '.*include.*'
      excludePattern '.*exclude.*'
      resolveRelativePaths true
    }
    dry('**/cpd.xml', 50, 25) {
    	useStableBuildAsReference true
  	}
    analysisCollector {
	  dry()            
      warnings()      
    }    
    sonar {
      branch()      
    }
    githubCommitNotifier()
  }
}

// Extra stuff
job.with {
  configure { project ->

    project/prebuilders << 'com.cloudbees.jenkins.GitHubSetCommitStatusBuilder'{
    }
  }
}
