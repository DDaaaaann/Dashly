const links = {
    jira: {
        sprint: {
            href: "https://socialeverzekeringsbank.atlassian.net/jira/software/c/projects/DMS/boards/1159",
        },
        work:{
            href: "https://socialeverzekeringsbank.atlassian.net/jira/your-work",
        }

    },
    teams: {
        href: "https://teams.microsoft.com/",
    },
    openshift: {
      href: "https://console-openshift-console.apps.ocp-dta.esp.svb.org/topology/ns/dms-dev",
    },
    jenkins: {
        featureToDev: {
            href: "https://jenkins-p.svb.org/dms/view/Feature%20to%20DEV/",
        },
        masterToOta: {
            href: "https://jenkins-p.svb.org/dms/view/Master%20to%20DEV-TST-ACC/",
        },
    },
    confluence: {
        href: "https://www.atlassian.com/software/confluence",
        logo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Confluence_logo.svg"
    },
    dynatrace: {
        href: "https://www.dynatrace.com",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/57/Dynatrace_logo.svg"
    },
    bitbucket: {
        href: "https://bitbucket-p.svb.org/projects/DMS",
        logo: "https://img.icons8.com/ios-filled/50/bitbucket.png"
    },
    annotation_service: {
        test: {
            openshift: "#projectA-Test-Oshift",
            splunk: "#projectA-Test-Splunk",
            dynatrace: "#projectA-Test-Dynatrace"
        },
        acc: {
            openshift: "#projectA-ACC-Oshift",
            splunk: "#projectA-ACC-Splunk",
            dynatrace: "#projectA-ACC-Dynatrace"
        },
        prod: {
            openshift: "#projectA-Prod-Oshift",
            splunk: "#projectA-Prod-Splunk",
            dynatrace: "#projectA-Prod-Dynatrace"
        }
    }
};




// Daily links
document.getElementById("jiraSprintLink").href = links.jira.sprint.href;
document.getElementById("jiraWorkLink").href = links.jira.work.href;
document.getElementById("teamsLink").href = links.teams.href;

// Dev links
document.getElementById("openshiftLink").href = links.openshift.href;
document.getElementById("featureToDevLink").href = links.jenkins.featureToDev.href;
document.getElementById("masterToOtaLink").href = links.jenkins.masterToOta.href;


document.getElementById("confluenceLogo").src = links.confluence.logo;

document.getElementById("dynatraceLink").href = links.dynatrace.href;
document.getElementById("dynatraceLogo").src = links.dynatrace.logo;

document.getElementById("bitbucketLink").href = links.bitbucket.href;
document.getElementById("bitbucketLogo").src = links.bitbucket.logo;

// Environment Links for Project A
document.getElementById("projectA-Test-Oshift").href = links.projectA.test.openshift;
document.getElementById("projectA-Test-Splunk").href = links.projectA.test.splunk;
document.getElementById("projectA-Test-Dynatrace").href = links.projectA.test.dynatrace;

document.getElementById("projectA-ACC-Oshift").href = links.projectA.acc.openshift;
document.getElementById("projectA-ACC-Splunk").href = links.projectA.acc.splunk;
document.getElementById("projectA-ACC-Dynatrace").href = links.projectA.acc.dynatrace;

document.getElementById("projectA-Prod-Oshift").href = links.projectA.prod.openshift;
document.getElementById("projectA-Prod-Splunk").href = links.projectA.prod.splunk;
document.getElementById("projectA-Prod-Dynatrace").href = links.projectA.prod.dynatrace;
