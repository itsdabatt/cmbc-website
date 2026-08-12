CMBC AUTOMATIC GALLERY SETUP

1. Upload this whole package to the ROOT of the cmbc-website GitHub repository.
   IMPORTANT: Upload .github/workflows/update-gallery.yml too.

2. In GitHub, open Settings > Actions > General.
   Under Workflow permissions, choose "Read and write permissions" and Save.
   (If already enabled, do nothing.)

3. Add approved photos to the gallery folder:
   gallery/picnic-01.jpg
   gallery/byf-night.png
   etc.

4. Commit the upload.

5. GitHub Actions will automatically create/update gallery.json.
   Cloudflare sees that commit and deploys the new gallery.

6. Wait 1-2 minutes and refresh the website.

WHY THIS VERSION WORKS:
The old version tried to read the GitHub repository through the public GitHub API. That can fail when the repository is private or API access is limited. This version does not depend on the GitHub API. It publishes a local gallery.json file with the site instead.
