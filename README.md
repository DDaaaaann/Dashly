# Dashly <img src="./assets/favicon/favicon.svg" alt="Dashly Logo" width="25"/>

<div align="center">
  <img src="./assets/logo.png" alt="Dashly Logo" width="300"/>
</div>

<p align="center">
  <strong>Create Sleek and Modern Dashboards in a Blink of an Eye</strong>
</p>

## Features

- **Multi-customizable**: Personalize your dashboard with ease. Just provide links or search fields
  in a simple configuration file.
- **Single HTML Output**: Everything packed in a single HTML file for simplicity and portability.
- **Multiple Themes**: Switch between different themes.
- **Customizable Search Fields**: Easily add and customize search fields to find what you need with
  a click.

## How It Works

### 1. **Configure Your Dashboard**

To get started, create a `config.yaml` file where you define the content and layout of your
dashboard. Here’s an example of how the configuration file might look:

```yaml
title: My StartPage
theme: Emerald Tides
clock: true
sections:
  - title: Work
    blocks:
      - title: Communication
        links:
          - title: Teams
            href: http://teams.microsoft.com
          - title: Slack
            href: https://slack.com
          - title: Outlook
            href: http://outlook.live.com
      - title: Search
        searchFields:
          - title: Search on google
            href: https://www.google.com/search?q=[search-term]
        links:
          - title: Wikipedia
            href: https://wikipedia.com
          - title: Translate
            href: https://translate.google.com/
  - title: Personal
    blocks:
      - title: Socials
        links:
          - href: https://www.instagram.com
            title: Instagram
          - href: https://www.facebook.com
            title: Facebook
```

### 2. **Generate the HTML Dashboard**

You can use **two** ways to generate the HTML dashboard:

#### Option 1: Run the `index.ts` script

If you prefer running the TypeScript script directly, follow these steps:

1. Clone the repository and install dependencies:

    ```bash
    git clone https://github.com/DDaaaaann/Dashly.git
    cd Dashly
    npm install
    ```

2. Fill out the `config.yaml` file with your desired dashboard settings.

3. Run the TypeScript script `index.ts` to generate the dashboard:

    ```bash
    ts-node index.ts config.yaml
    ```

4. The generated `index.html` will be available in the root folder, ready to be used.

#### Option 2: Use `npx` for Convenience

For a faster, one-liner setup without needing to install the project globally, simply run the
following command:

```bash
npx generate-dashboard config.yaml
```

This will automatically generate the dashboard HTML file using the provided `config.yaml` file and
save it to `index.html`.

### 3. **Use Your Dashboard**

Once the HTML is generated, you can easily open it with you browser of choice. Make sure to set it
as your homepage.

## Themes

You can choose between multiple pre-built themes, or create your own. The available themes are:

- **Night Owl**
- **Emerald Tides**

### Night Owl

Here’s an example of a generated dashboard with _Night Owl_ theme:
![Night Owl Theme](https://github.com/user-attachments/assets/2f35018f-5abf-498f-9de7-d60bb9037d3f)

<a href="/examples/Night Owl/index.html">Night Owl</a>

### Emerald Tides

Here’s an example of a generated dashboard with _Emerald Tides_ theme:
![Emerald Tides Theme](https://github.com/user-attachments/assets/767ee69c-4e84-4e43-975d-41739e540391)

<a href="/examples/Emerald Tides/index.html">Emerald Tides</a>

## Customizable Search Fields

Need to add custom search fields? Just include them in the `config.yaml` file, and the app will
automatically add them to the generated dashboard.

Place `[search-term]` in the URL where the query should go, and Dashly will automatically replace it
whit your input.

```yaml
searchFields:
  - title: Search on Wikipedia
    href: https://nl.wikipedia.org/w/index.php?search=[search-term]
```

<br>
<br>
<br>
<div align="center">
    <img src="./assets/favicon/favicon.svg" alt="Dashly Logo" width="25"/>
</div>


<p align="center"> Made with 🧡 by <a href="https://github.com/DDaaaaann">DDaaaaann</a></p>
