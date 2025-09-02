<?xml version="1.0" encoding="UTF-8"?>
<schema xmlns="http://purl.oclc.org/dsdl/schematron"
    queryBinding="xslt2"
    schemaVersion="iso">
  <title>Schema for Factur-X; 1.07.3; EN16931-COMPLIANT (FULLY)</title>
  <ns uri="urn:un:unece:uncefact:data:standard:CrossIndustryInvoice:100" prefix="rsm"/>
  <ns uri="urn:un:unece:uncefact:data:standard:QualifiedDataType:100" prefix="qdt"/>
  <ns uri="urn:un:unece:uncefact:data:standard:ReusableAggregateBusinessInformationEntity:100" prefix="ram"/>
  <ns uri="urn:un:unece:uncefact:data:standard:UnqualifiedDataType:100" prefix="udt"/>

  <pattern>
   <rule context="invoice/id">
      <let name="scheme" value="@scheme"/>
      <assert test="string-length($scheme)=0">Value of '@schemeID' must not be defined.</assert>
    </rule>

  </pattern>
</schema>
