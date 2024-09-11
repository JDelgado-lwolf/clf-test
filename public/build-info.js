fetch("/build-info.json")
    .then(res => res.json())
    .then(data => {
        const isAgentMetrics = window.location.host.indexOf('agentmetrics') >= 0;
        const isLoginPage = window.location.pathname.indexOf('login') >= 0;
        let appName = isAgentMetrics ? 'AgentMetrics' : 'BrokerMetrics';
        if (data) document.title = `${appName} ${data?.version}`;
        if (isLoginPage) document.title = `${appName} Product Suite`;
    })
    .catch(err => console.error(err));
