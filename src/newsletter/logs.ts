type LogItem = {
  log_name: string
  log_content: string | object | any[]
}

const logContent: LogItem[] = []

export function log(
  itemName: LogItem['log_name'],
  content: LogItem['log_content']
) {
  logContent.push({
    log_name: itemName,
    log_content: content
  })
}

export function logFunction(
  functionName: string,
  parameters: any,
  response: any
) {
  log(`=====Function: ${functionName} =====`, {
    parameters,
    response
  })
}

export function logError(errorName: string, errorData: any) {
  log(`===== Error: ${errorName} =====`, errorData)
}

export async function triggerLogsSlack() {
  const textContent = logContent
    .map(({ log_name, log_content }) => {
      return `*${log_name}*:\n${JSON.stringify(log_content, null, 2)}`
    })
    .join('\n\n')

  try {
    await fetch(process.env.SLACK_LOGS_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: textContent
      })
    })
  } catch (err) {
    console.log(err)
  }
}
