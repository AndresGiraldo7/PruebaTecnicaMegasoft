package com.library;

import org.springframework.boot.SpringBootVersion;
import org.springframework.core.SpringVersion;

public class VersionChecker {

    public static void main(String[] args) {

        System.out.println("==============================================");
        System.out.println("   VALIDACIÓN DE VERSIONES - PRUEBA MEGASOFT");
        System.out.println("==============================================");

        // Versión real del JDK usado por la JVM en runtime
        System.out.println("Java Runtime Version  : " + System.getProperty("java.runtime.version"));
        System.out.println("Java Specification    : " + System.getProperty("java.specification.version"));
        System.out.println("Java VM Version       : " + System.getProperty("java.vm.version"));

        // Versión de Spring Boot
        System.out.println("Spring Boot Version   : " + SpringBootVersion.getVersion());

        // Versión del núcleo de Spring Framework
        System.out.println("Spring Framework      : " + SpringVersion.getVersion());

        // Versión de Tomcat embebido
        Package tomcat = org.apache.catalina.startup.Tomcat.class.getPackage();
        System.out.println("Tomcat Version        : " + tomcat.getImplementationVersion());

        System.out.println("==============================================");
    }
}