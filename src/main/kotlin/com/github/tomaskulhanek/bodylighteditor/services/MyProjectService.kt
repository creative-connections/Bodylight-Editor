package com.github.tomaskulhanek.bodylighteditor.services

import com.intellij.openapi.project.Project
import com.github.tomaskulhanek.bodylighteditor.MyBundle

class MyProjectService(project: Project) {

    init {
        println(MyBundle.message("projectService", project.name))
    }
}
