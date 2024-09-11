# XBM

__XBM__ <br/>
clf-aergo-client <br/>
*(formerly aergo-client common look and feel) (CLF)*

## INSTALL

#### Clone, Install, Edit hosts file
`git clone https://github.com/terradatum/clf-aergo-client.git`

`cd clf-aergo-client`

`npm install`

Add the following entries to your hosts file (`C:\Windows\System32\drivers\etc\hosts` or equivalent)

```
127.0.0.1	brokermetrics.local.lwolf.com
127.0.0.1	agentmetrics.local.lwolf.com
```

## BUILD
`npm run build`

## RUN

To run via localhost:5000

`npm run dev`


To run via brokermetrics.local.lwolf.com (port 80)

`npm run dev-xbm`


To run via agentmetrics.local.lwolf.com (port 80)

`npm run dev-xam`