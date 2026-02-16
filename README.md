# Dashly <img src="https://github.com/user-attachments/assets/94ef8cf6-7831-431c-956c-9fbc22ea9675" alt="Dashly Logo" width="25"/>

<div align="center">
  <img src="https://github.com/user-attachments/assets/254e87a3-97db-47a4-9016-937216512afa" alt="Dashly Logo" width="300"/>
</div>

<p align="center">
  <strong>Generate beautiful dashboards from simple YAML configs.</strong>
</p>

## Features

- 🛠️ **Multi-customizable**: Personalize your dashboard with ease. Just provide links or search
  fields
  in a simple configuration file.
- 🗜️ **Single HTML Output**: Everything packed in a single HTML file for simplicity and portability.
- 🎨 **Multiple Themes**: Switch between different themes.
- 🔍 **Live Search**: Quickly find what you need with a built-in search feature.
- 🔎 **Customizable Search Fields**: Easily add and customize search fields to find what you need
  with
  a click.

## How It Works

### 1. **Configure Your Dashboard**

To get started, create a `config.yaml` file where you define the content and layout of your
dashboard. Here’s an example of how the configuration file might look:

```yaml
title: My StartPage
theme: Emerald Tides
clock: true
liveSearch: true
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

#### Configuration Options

| Option     | Description                                                           | Values                                                                   | Default |
|------------|-----------------------------------------------------------------------|--------------------------------------------------------------------------|---------|
| title      | Title for the dashboard                                               |                                                                          | null    |
| theme      | Theme used for the dashboard                                          | `Emerald Tides`<br/>`Night Owl`<br/>`Silent Alps`<br/>`Bright Tangerine` | none    | 
| clock      | If true, digital clock and date are shown                             |                                                                          | false   |
| liveSearch | If true, a search bar with live search will be added to the dashboard |                                                                          | false   |
| sections*  | Sections of the dashboard                                             | see [Sections Configuration](#Sections Configuration)                    | null    |

#### Sections Configuration

<table>
    <tr>
        <th colspan="5">Options</th>
        <th>Values</th>
    </tr>
    <tr>
        <td rowspan="11"><b>sections:</b></td>
        <td colspan="4" align="right"><i>title</i></td>
        <td>title of the section</td>
    </tr>
    <tr>
        <td rowspan="10"><b>blocks:</b></td>
        <td colspan="3"><i>title</i>*</td>
        <td>title of the blobk</td>
    </tr>
    <tr>
        <td rowspan="2"><b>links:</b></td>
        <td colspan="2"><i>title</i></td>
        <td>title of the link</td>
    </tr>
    <tr>
        <td colspan="2"><i>href</i>*</td>
        <td>url of the link</td>
    </tr>
    <tr>
        <td rowspan="2"><b>searchFields:</b></td>
        <td colspan="2"><i>title</i>*</td>
        <td>title of the search field</td>
    </tr>
    <tr>
        <td colspan="2"><i>href</i>*</td>
        <td>href of the search field, see: <br><a href="#customizable-search-fields">Customizable Search Fields</a></td>
    </tr>
    <tr>
        <td rowspan="5"><b>groups:</b></td>
        <td colspan="2"><i>title</i>*</td>
        <td>title of the group</td>
    </tr>
    <tr>
        <td rowspan="2"><b>links:</b></td>
        <td><i>title</i></td>
        <td>title of the link</td>
    </tr>
    <tr>
        <td><i>href</i>*</td>
        <td>href of the link</td>
    </tr>
    <tr>
        <td rowspan="2">searchFields:</td>
        <td><i>title</i>*</td>
        <td>title of the search field</td>
    </tr>
    <tr>
        <td><i>href</i>*</td>
        <td>href of the search field, see: <br><a href="#customizable-search-fields">Customizable Search Fields</a></td>
    </tr>
</table>

*\* options marked with a star are required*

### 2. **Generate the HTML Dashboard**

You can use **two** ways to generate the HTML dashboard:

#### Option 1: Using npx

For a faster, one-liner setup without needing to install the project locally, simply run the
following command:

```bash
npx dashly
```

> [!IMPORTANT]  
> Make sure your _config.yaml_ is available in the current directory

This will automatically generate the dashboard HTML file using the provided `config.yaml` file and
save it to `index.html`.

#### Option 2: Build locally

If you prefer building the TypeScript script locally, follow these steps:

1. Clone the repository and install dependencies:

    ```bash
    git clone https://github.com/DDaaaaann/Dashly.git
    cd Dashly
    npm install
    npm run build
    npm run link
    ```

2. Fill out the `config.yaml` file with your desired dashboard settings.

3. Run the script to generate the dashboard:

    ```bash
    dashly
    ```

4. The generated `index.html` will be available in the current folder, ready to be used.

### 3. **Use Your Dashboard**

Once the HTML is generated, you can easily open it with you browser of choice. Make sure to set it
as your homepage.

## Themes

You can choose between multiple pre-built themes, or create your own. The available themes are:

- **Night Owl**
- **Emerald Tides**
- **Silent Alps**
- **Bright Tangerine**

### Night Owl

Here’s an example of a generated dashboard with _Night Owl_ theme:
![Night Owl Theme](https://github.com/user-attachments/assets/60d43c86-075c-43b2-9c27-a07be6b3888a)

<a href="/examples/Night Owl/index.html">Night Owl</a>

### Emerald Tides

Here’s an example of a generated dashboard with _Emerald Tides_ theme:

![Emerald Tides Theme](https://github.com/user-attachments/assets/d95a4d7b-8131-40fd-bd6b-e18bf0f1dc43)

<a href="/examples/Emerald Tides/index.html">Emerald Tides</a>

### Silent Alps

Here’s an example of a generated dashboard with _Silent Alps_ theme:

<a href="/examples/Silent Alps/index.html">Silent Alps</a>

### Bright Tangerine

Here’s an example of a generated dashboard with _Bright Tangerine_ theme:

![Bright Tangerine Theme](https://github.com/user-attachments/assets/cd555a46-5f9b-400c-a126-82df05dc3fe4)

<a href="/examples/Bright Tangerine/index.html">Bright Tangerine</a>

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
<div align="center">
    <img src="https://github.com/user-attachments/assets/94ef8cf6-7831-431c-956c-9fbc22ea9675" alt="Dashly Logo" width="25"/>
</div>
<br>

<p align="center"> Made with 🧡 by <a href="https://github.com/DDaaaaann">DDaaaaann</a></p>
