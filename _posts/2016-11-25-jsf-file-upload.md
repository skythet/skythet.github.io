---
title: "JSF 2.1: файл жүктеу"
category: problem-solve
tags: "jsf,file-upload,jsf2.1"
published: true
---

Java Server Faces веб парақ жазуға арналған фреймворк. Бірақ ірі проектілерде
пайдаланылғанын әлі өз көзіммен көрмеппін. Әйтсе де, кішігірім админ беттерін жасауға
бірбеттік утилиталық құралдар жасауға ыңғайлы.

Сондай бір беттен ғана тұратын утилита жасау қажеттілігі туды, тек бір ерекшелігі
пайдаланушыда файл жүктеу мүмкіндігі болуы керек. Бірден гуглға шапқан мен мынандай
нәрсеге тап болдым:

```xml
<h:form enctype="multipart/form-data">
    <h:inputFile value="#{bean.file}">
        <f:ajax listener="#{bean.save}" />
    </h:inputFile>
</h:form>
```

Не керек проектіге осыны тықпалап істетіп көрмек болдым. Бірақ ештеңе шықпады. Файл
жүктелмейді. Себебі мынада екен, серверлерде Jboss 7.1 орнатылған. Ал ол нұсқада
JSF спецификациясының 2.1 нұсқасы. Ал жоғарыдағы көрсетілген файл жүктеу мүмкіндігі тек 2.2 нұсқадан
бастап қана пайда болған. Сервердегі JSF нұсқасын жаңарту ұзақ уақыт алады, бірнеше
арнайы процедурадан өткізілуі керек (мысалы, тестілеу). Сондықтан, jsf 2.2 пайдалану
мүмкіндігі жоқ. Бірақ ол нұсқаға дейін адамдар басқаша өмір сүрген болуы керек қой?
Дәл солай. Арнайы библиотека баршылық екен.

[Tomahawk](http://myfaces.apache.org/tomahawk/) jsf-ке қосымша компоненттер кітапханасы.
Сол кітапханада маған керек файл жүктеу мүмкіндігі бар екен. Алдымен проектіге
кітапхананы қосамыз (менде gradle):

```
compile group: 'org.apache.myfaces.tomahawk', name: 'tomahawk21', version: '1.1.14'
```

Мұндағы `tomahawk21` деген атауға назар аударамыз, ол JSF 2.1 нұсқаға арналған дегенді
білдіреді. Егер жай ғана `tomahawk` деп жазатын болсақ ол 2.2 нұсқаға арналған кітапханалар.
Мен басында солай жазып алып біраз әбігерге түстім. Енді web.xml файлына
келесі баптауларды қосу керек:

```xml
    <filter>
        <filter-name>MyFacesExtensionsFilter</filter-name>
        <filter-class>org.apache.myfaces.webapp.filter.ExtensionsFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>MyFacesExtensionsFilter</filter-name>
        <servlet-name>Faces Servlet</servlet-name>
    </filter-mapping>
```

Bean объектімізде файлға арналған айнымалыны төмендегідей өзгертеміз:

```java
@Named("bean")
@ManagedBean
@RequestScoped
public class Bean {

    private UploadedFile codesFile;


    public ImportStartBean() {
    }

    public String upload() throws IOException {
		codesFile.getInputStream(); // ары қарай бұл stream-ды керегінше пайдалана беруге болады
    }

    public UploadedFile getCodesFile() {
        return codesFile;
    }

    public void setCodesFile(UploadedFile codesFile) {
        this.codesFile = codesFile;
    }

}

```

Ал біздің xhtml файлымыз мына түрде болады:

```xml
<!DOCTYPE html>
<html lang="en"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:t="http://myfaces.apache.org/tomahawk"
      xmlns:c="http://java.sun.com/jsp/jstl/core"
      xmlns:ui="http://java.sun.com/jsf/facelets">
<h:head>
    <title>Файл жүктеу</title>
</h:head>
<h:body>
    <h:form enctype="multipart/form-data">

        <table>
            <tr>
                <td>Файл:</td> <td><t:inputFileUpload id="codesFile" value="#{bean.codesFile}" required="true" /></td>
                <td><h:message for="codesFile" style="color: red;" /></td>
            </tr>
            <tr>
                <td></td>
                <td>
                    <h:commandButton value="Жүктеу" action="#{bean.upload}" />
                </td>
            </tr>

        </table>
    </h:form>

</h:body>
</html>
```

Файлды жүктеу үшін осы жеткілікті.
