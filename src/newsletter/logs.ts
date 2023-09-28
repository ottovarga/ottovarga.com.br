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
  // split logContent into ~= 2000 characters chunks (break only on \n\n\n)
  const textContent = logToString(logContent).match(/[\s\S]{1,2000}/g)

  try {
    for (const text of textContent) {
      await fetch(process.env.SLACK_LOGS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text
        })
      })
    }
  } catch (err) {
    console.log(err)
  }
}

function logToString(log: LogItem[]) {
  return log
    .map(({ log_name, log_content }) => {
      return `*${log_name}*:\n${JSON.stringify(log_content, null, 2)}`
    })
    .join('\n\n\n')
}
