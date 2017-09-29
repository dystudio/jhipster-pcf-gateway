package io.pivotal.fe.rhardt.config;

import io.pivotal.fe.rhardt.security.AuthoritiesConstants;

import io.github.jhipster.config.JHipsterProperties;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.client.loadbalancer.RestTemplateCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.codec.Base64;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@Configuration
@EnableResourceServer
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class MicroserviceSecurityConfiguration extends ResourceServerConfigurerAdapter {

    private final JHipsterProperties jHipsterProperties;

    private final DiscoveryClient discoveryClient;

    public MicroserviceSecurityConfiguration(JHipsterProperties jHipsterProperties,
            DiscoveryClient discoveryClient) {

        this.jHipsterProperties = jHipsterProperties;
        this.discoveryClient = discoveryClient;
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer resources) throws Exception {
        resources.resourceId("jhipster");
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .csrf()
            .disable()
            .headers()
            .frameOptions()
            .disable()
        .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
            .authorizeRequests()
            .antMatchers("/api/profile-info").permitAll()
            .antMatchers("/api/**").authenticated()
            .antMatchers("/management/health").permitAll()
            .antMatchers("/management/**").permitAll()
            .antMatchers("/swagger-resources/configuration/ui").permitAll()
            .antMatchers("/authdetails").permitAll()
            .antMatchers("/account").authenticated();
    }

    @Bean
    public TokenStore tokenStore(JwtAccessTokenConverter jwtAccessTokenConverter) {
        return new JwtTokenStore(jwtAccessTokenConverter);
    }

    @Bean
    public JwtAccessTokenConverter jwtAccessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setVerifierKey(getKeyFromAuthorizationServer());
        return converter;
    }

//    @Bean
//    public RestTemplate loadBalancedRestTemplate(RestTemplateCustomizer customizer) {
//        RestTemplate restTemplate = new RestTemplate();
//        customizer.customize(restTemplate);
//        return restTemplate;
//    }

    @Value("${ssoServiceUrl}")
    private String ssoServiceUrl;

    private String getKeyFromAuthorizationServer() {
        // Load available UAA servers
        //discoveryClient.getServices();
        HttpEntity<Void> request = new HttpEntity<Void>(new HttpHeaders());
        return (String) new RestTemplate()
            .exchange(ssoServiceUrl+"/token_key", HttpMethod.GET, request, Map.class).getBody()
            .get("value");

    }

    @Value("${security.oauth2.client.accessTokenUri}")
    private String accessTokenUri;

    @Value("${security.oauth2.client.clientId}")
    private String clientId;

    @Value("${security.oauth2.client.clientSecret}")
    private String clientSecret;

    public String getAccessTokenUri(){
        return accessTokenUri;
    }

    public String getAuthHeaderValue() {
        try{
            return new String(Base64.encode(String.format("%s:%s", clientId,
                clientSecret).getBytes("UTF-8")), "UTF-8");
        }
        catch (UnsupportedEncodingException uee){}
        return null;

    }



}
