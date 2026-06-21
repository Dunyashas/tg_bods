export default async function handler(req, res) {

  const token = process.env.GITHUB_TOKEN;

  const owner = 'Dunyashas';
  const repo = 'tg_bods';
  const file = 'admins.json';

  const githubUrl =
    `https://api.github.com/repos/${owner}/${repo}/contents/${file}`;

  try {

    if (req.method !== 'POST') {
      return res.status(405).json({
        error: 'Method not allowed'
      });
    }

    const { admins } = req.body;

    const currentFile = await fetch(githubUrl, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json'
      }
    });

    const currentData = await currentFile.json();

    const content = Buffer
      .from(JSON.stringify(admins, null, 2))
      .toString('base64');

    const update = await fetch(githubUrl, {
      method: 'PUT',
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update admins.json',
        content,
        sha: currentData.sha
      })
    });

    const result = await update.json();

    return res.status(200).json(result);

  } catch (e) {

    return res.status(500).json({
      error: e.message
    });

  }
}
