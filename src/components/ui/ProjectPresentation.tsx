"use client";
import {useState} from "react";
import type {Project} from "@/data/portfolio";
import {projectLink} from "@/lib/project-link";

export function ProjectLink({project}:{project:Project}){
 const url=projectLink(project.url);
 return <div className="project-link-row">{url?<a className="project-open-link" href={url} target="_blank" rel="noopener noreferrer">Open Link ↗</a>:<><button className="project-open-link" disabled>Open Link ↗</button><small>Tautan proyek menyusul.</small></>}</div>;
}
export function ProjectPreview({project,thumbnail=false}:{project:Project;thumbnail?:boolean}){
 const[failed,setFailed]=useState(false),original=!!project.screenshot;
 const src=original?(thumbnail?project.thumbnail||project.screenshot:project.screenshot):(thumbnail?project.illustrationThumbnail||project.illustration:project.illustration);
 return <figure className="project-preview">{src&&!failed?<img src={src} alt={original?`Screenshot asli ${project.title}`:`Sketsa konseptual ${project.title}; bukan screenshot aplikasi`} loading="lazy" onError={()=>setFailed(true)}/>:<div className="note">Visual proyek belum tersedia.</div>}<figcaption>{original?"Screenshot proyek":"Ilustrasi konseptual / bukan screenshot"}</figcaption></figure>;
}
export function ProjectCard({project}:{project:Project}){
 return <article className="project-card"><div className="project-top"><span className="mono">{project.category||"PROJECT / FIELD NOTES"}</span><span className={`status ${project.status==="Dalam pengembangan"?"wip":""}`}>{project.status==="Dalam pengembangan"?"Dalam Pengembangan":project.status}</span></div>{(project.screenshot||project.illustration)&&<ProjectPreview project={project} thumbnail/>}<h3>{project.title}</h3><p>{project.description}</p><ProjectLink project={project}/></article>;
}
export function ProjectDetail({project}:{project:Project}){
 return <article className="project-detail"><div className="project-inline-preview"><ProjectPreview project={project}/></div><span className="eyebrow">{project.category||"DEVELOPMENT / FIELD NOTES"}</span><h3>{project.title}</h3><span className={`status ${project.status==="Dalam pengembangan"?"wip":""}`}>{project.status==="Dalam pengembangan"?"Dalam Pengembangan":project.status}</span><p className="section-intro">{project.description}</p>{!project.screenshot&&<p className="small-note">Sketsa adalah ilustrasi konsep. Screenshot dan dokumentasi asli belum ditambahkan.</p>}<ProjectLink project={project}/></article>;
}
