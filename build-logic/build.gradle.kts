plugins {
    `kotlin-dsl`
}

repositories {
    gradlePluginPortal()
}

dependencies {
    implementation(libs.kotlin.gradle.plugin)
    implementation(libs.ktlint.gradle.plugin)
}
