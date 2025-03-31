import pjson from '../../package.json';

const bold = '\x1b[1m';
const gray = '\x1b[90m';
const green = '\x1b[32m';
const blue = '\x1b[34m';
const yellow = '\x1b[33m';
const reset = '\x1b[0m';

function printUsage() {
  const usage = `
  ${bold}USAGE:${reset} 
    dashly [options]
    
  ${bold}OPTIONS:${reset}
    ${blue}-h, --help${reset}           ${gray}Show this help message and exit${reset}
    ${blue}-v, --version${reset}        ${gray}Show version information and exit${reset}
    ${blue}-i, --input <file>${reset}   ${gray}Specify a YAML config file (default: ${yellow}./config.yaml${gray})${reset}
    ${blue}-o, --output <file>${reset}  ${gray}Specify the output HTML file (default: ${yellow}./index.html${gray})${reset}
    ${blue}-V, --verbose${reset}        ${gray}Enable verbose logging for debugging${reset}
  `;

  console.log(usage);
}

function printVersion() {
  const version = pjson.version;
  console.log(`${green}dashly version ${version}${reset}`);
}

// Utility function to retrieve argument values
function getArgValue(long: string, short?: string): string | undefined {
  const args = process.argv.slice(2);
  const index = args.indexOf(long);
  if (index !== -1) {
    return args[index + 1];
  }
  if (short) {
    const shortIndex = args.indexOf(short);
    if (shortIndex !== -1) {
      return args[shortIndex + 1];
    }
  }
  return undefined;
}

export function parseArgs() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }

  if (args.includes('--version') || args.includes('-v')) {
    printVersion();
    process.exit(0);
  }

  process.env.VERBOSE = (args.includes('--verbose') || args.includes('-V')).toString();
  process.env.INPUT_PATH = getArgValue('--input', '-i') || './config.yaml';
  process.env.OUTPUT_PATH = getArgValue('--output', '-o') || './index.html';
}
