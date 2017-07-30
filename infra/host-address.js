import os from 'os'

function color(text) {
  return `\u001b[1m\u001b[34m${text}\u001b[39m\u001b[22m`
}

export default function getHostAddress() {
  const hosts = Object.values(os.networkInterfaces()).reduce((result, net) => {
    const externalAddresses = net
      .filter(address => address.family === 'IPv4' && !address.internal)
      .map(address => address.address)
    return result.concat(externalAddresses)
  }, [])

  const host = hosts[0]

  if (hosts.length > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      [
        'More than one public host address found. Using the first found.',
        '',
        `${hosts}`,
      ].join('\n'),
    )
  }

  // When serving on local network, add console messaging for all available hosts
  ;['localhost', host].forEach(h => {
    const text = color(`http://${h}:8080/`)
    console.log(`Project is running at ${text}`) // eslint-disable-line no-console
  })

  return host
}
