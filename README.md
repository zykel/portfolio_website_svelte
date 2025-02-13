# Portfolio website

## How to add a new project

- Determine a unqiue `<projectId>` to refer to the project with
- Add assets like images and videos under _static/projects/\<projectId\>/_
  - At least a file `title_pic.png` is required
- Add a teaser video under _static/_
- Walk trough the components used in _src/routes/projects/[projectId]/[+page.svelte](src/routes/projects/[projectId]/+page.svelte)_ and add the necessary information
- To add the projects to the home page, add the corresponding information in _src/lib/components/main_page_sections/[SectionProjects.svelte](src/lib/components/main_page_sections/SectionProjects.svelte)_
